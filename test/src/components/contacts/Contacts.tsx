import { useEffect, useRef, useState } from 'react';

import { Button, Divider, Form, Input, Spacer, Splitter, Stack, Text, View } from 'bare';

type Contact = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
};

const Contacts = ({ ...props }) => {
  const databaseRef = useRef<IDBDatabase>();
  const [contacts, setContacts] = useState<Contact[]>();
  const [selectedContactId, setSelectedContactId] = useState<number>();

  // useEffect(() => {
  //   if (contacts) {
  //     setSelectedContact(contacts.find(contact => contact.id === selectedContactId));
  //   }
  // }, [contacts, selectedContactId]);

  // useEffect(() => {
  //   if (databaseRef.current) {
  //     databaseRef.current
  //       .transaction('contacts', 'readwrite')
  //       .objectStore("contacts")
  //       .put(selectedContact);
  //   }
  // }, [selectedContact]);

  useEffect(() => {
    (async () => {
      const request = window.indexedDB.open("Database", 1);

      request.onupgradeneeded = (event: any) => {
        databaseRef.current = event.target.result;

        if (databaseRef.current) {
          const objectStore = databaseRef.current.createObjectStore("contacts", {
            keyPath: "id",
            autoIncrement: true,
          });

          objectStore.createIndex("id", "id", { unique: true });
          objectStore.createIndex("email", "email", { unique: true });

          objectStore.transaction.oncomplete = (event) => {
            if (databaseRef.current) {
              const customerObjectStore = databaseRef.current
                .transaction("contacts", "readwrite")
                .objectStore("contacts");

              customerObjectStore.add({ firstName: 'John', lastName: 'Appleseed', email: 'john.appleseed@example.com' });
              customerObjectStore.add({ firstName: 'Susan', lastName: 'Hotchkins', email: 'susan.hotchins@example.com' });
            }
          };
        }
      };

      request.onsuccess = (event: any) => {
        databaseRef.current = event.target.result;

        if (databaseRef.current) {
          databaseRef.current
            .transaction('contacts')
            .objectStore("contacts")
            .getAll().onsuccess = (event: any) => {
              console.log(event.target.result);

              setContacts(event.target.result);
            };
        }
      };
    })();
  }, []);

  const handleFormValueChange = (key: string, value: any) => {
    console.log(key, value);

    setContacts(contacts => {
      const foo = contacts?.find(contact => contact.id === selectedContactId);

      if (!foo) {
        return contacts;
      }

      const updatedContact = {
        ...foo,
        [key]: value,
      };

      if (databaseRef.current) {
        databaseRef.current
          .transaction('contacts', 'readwrite')
          .objectStore("contacts")
          .put(updatedContact);
      }

      return contacts?.map(contact => contact.id === selectedContactId
        ? {
          ...contact,
          [key]: value,
        }
        : contact);
    });
  };

  const selectedContact = contacts?.find(contact => contact.id === selectedContactId);

  return (
    <Splitter horizontal {...props}>

      <View fillColor="gray-1" minWidth={192}>
        <View horizontal padding="small large">
          <Button solid title="New Contact" />
        </View>
        <Divider />
        <View padding="large">
          <Text fontSize="large">Contacts</Text>
          <Spacer size="small" />
          <Input />
        </View>
        <Divider />
        <View flex padding="small" fillColor="white">
          <Stack divider>
            {contacts?.map(contact => (
              <View padding="small" onClick={() => setSelectedContactId(contact.id)}>
                <Text>{contact.firstName} {contact.lastName}</Text>
              </View>
            ))}
          </Stack>
          <Divider />
        </View>
      </View>

      <View flex>
        <View horizontal padding="small large">
          <Stack horizontal spacing="small">
            <Button icon="edit" title="Edit" />
          </Stack>
          <Spacer flex size="large" />
          <Stack horizontal spacing="small">
            <Button icon="message" title="Message" />
            <Button icon="video" title="Facetime" />
            <Button icon="envelope" title="Email" />
          </Stack>
        </View>
        <Divider />
        <View padding="large">
          <Text fontSize="large">
            {selectedContact && (
              <>{selectedContact.firstName} {selectedContact.lastName}</>
            )}
          </Text>
          <Spacer size="xxlarge" />
          <View>
            <Form
              id="form"
              flush
              fields={[
                { key: 'firstName', label: 'First Name', type: 'text' },
                { key: 'lastName', label: 'Last Name', type: 'text' },
                // { key: 'phone', label: 'phone', type: 'text' },
                { key: 'email', label: 'Email', type: 'text' },
              ]}
              initialValues={selectedContact}
              onFieldChange={handleFormValueChange}
            >
            </Form>
          </View>
        </View>
      </View>

    </Splitter>
  );
};

export default Contacts;
