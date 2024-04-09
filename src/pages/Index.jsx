import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Textarea, Stack, IconButton, Flex, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:1337/api/events";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEvents(data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const createEvent = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            description,
          },
        }),
      });
      const data = await response.json();
      setEvents([...events, data.data]);
      setName("");
      setDescription("");
      toast({
        title: "Event created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const updateEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/${editingEventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            description,
          },
        }),
      });
      const data = await response.json();
      setEvents(events.map((event) => (event.id === data.data.id ? data.data : event)));
      setName("");
      setDescription("");
      setEditingEventId(null);
      toast({
        title: "Event updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      setEvents(events.filter((event) => event.id !== id));
      toast({
        title: "Event deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const startEditing = (event) => {
    setEditingEventId(event.id);
    setName(event.attributes.name);
    setDescription(event.attributes.description);
  };

  return (
    <Box maxWidth="600px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" textAlign="center" marginBottom={8}>
        Event Management
      </Heading>

      <Stack spacing={4} marginBottom={8}>
        <Input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button colorScheme="blue" onClick={editingEventId ? updateEvent : createEvent}>
          {editingEventId ? "Update Event" : "Create Event"}
        </Button>
      </Stack>

      <Stack spacing={4}>
        {events.map((event) => (
          <Box key={event.id} borderWidth={1} borderRadius="md" padding={4} backgroundColor="gray.100">
            <Flex justify="space-between" align="center">
              <Box>
                <Heading as="h2" size="md">
                  {event.attributes.name}
                </Heading>
                <Text>{event.attributes.description}</Text>
              </Box>
              <Box>
                <IconButton icon={<FaEdit />} marginRight={2} onClick={() => startEditing(event)} />
                <IconButton icon={<FaTrash />} onClick={() => deleteEvent(event.id)} />
              </Box>
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;
