import { useEffect, useRef, useState } from 'react';

import { Button, Divider, Form, Input, Spacer, Splitter, Stack, Text, View } from 'bare';

type Contact = {
  id: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
};

const Contacts = ({ ...props }) => {
  const databaseRef = useRef<IDBDatabase>();

  const [contacts, setContacts] = useState<Contact[]>();
  const [selectedContactId, setSelectedContactId] = useState<number>();
  const [isEditing, setIsEditing] = useState(false);

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
              customerObjectStore.add({ firstName: 'Ryan', lastName: 'Blanchard', email: 'ryan.blanchard@example.com' });
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
              setContacts(event.target.result);
              setSelectedContactId(event.target.result[0].id);
            };
        }
      };
    })();
  }, []);

  const handleFormValueChange = (key: string, value: any) => {
    console.log('handleFormValueChange', key, value);

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
          <Button solid primary title="New Contact" />
        </View>
        <Divider />
        <View padding="large">
          <Text fontSize="large">Contacts</Text>
          <Spacer size="small" />
          <Input />
        </View>
        <Divider />
        <View flex padding="small" fillColor="white">
          <Stack >
            {contacts?.map(contact => (
              <View key={contact.id} padding="small" fillColor={contact.id === selectedContactId ? 'blue-5' : undefined} style={{ borderRadius: 2.5 }} onClick={() => setSelectedContactId(contact.id)}>
                <Text
                  textColor={contact.id === selectedContactId ? 'white' : undefined}
                  fontWeight={contact.id === selectedContactId ? 'semibold' : undefined}
                >
                  {contact.firstName} {contact.lastName}
                </Text>
              </View>
            ))}
          </Stack>
          {/* <Divider /> */}
        </View>
      </View>

      <View flex>
        <View horizontal padding="small large">
          <Stack horizontal spacing="large">
            <Button text icon="message" title="Message" titleTextColor="blue-5" />
            <Button text icon="video" title="Facetime" titleTextColor="blue-5" />
            <Button text icon="envelope" title="Email" titleTextColor="blue-5" />
          </Stack>
          <Spacer flex size="large" />
          <Stack horizontal spacing="small">
            <Button
              primary
              icon="edit"
              title={isEditing ? 'Done' : 'Edit'}
              onClick={() => setIsEditing(isEditing => !isEditing)}
            />
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
                ...(isEditing || selectedContact?.firstName ? [{ key: 'firstName', label: 'First Name' } as const] : []),
                ...(isEditing || selectedContact?.lastName ? [{ key: 'lastName', label: 'Last Name' } as const] : []),
                ...(isEditing || selectedContact?.phone ? [{ key: 'phone', label: 'Phone' } as const] : []),
                ...(isEditing || selectedContact?.email ? [{ key: 'email', label: 'Email' } as const] : []),
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
