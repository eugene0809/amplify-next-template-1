"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);



const getUrlResult = await getUrl({
  path: 'public/album/2024/1.jpg',
  // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
  options: {
    validateObjectExistence?: false,  // Check if object exists before creating a URL
    expiresIn?: 20 // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
    useAccelerateEndpoint?: true; // Whether to use accelerate endpoint
  },
});
console.log('signed URL: ', getUrlResult.url);
console.log('URL expires at: ', getUrlResult.expiresAt);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
