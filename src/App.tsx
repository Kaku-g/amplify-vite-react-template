import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import { FileUploader } from "./components/FileUploader";
import { list } from "aws-amplify/storage";

const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [data, setData] = useState<any>([]);
  const [filesystem, setFilesystem] = useState<any>({});

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  function processStorageList(response: any) {
    const filesystem = {};
    const add = (source: any, target: any, item: any) => {
      const elements = source.split("/");
      const element = elements.shift();
      if (!element) return; // blank
      target[element] = target[element] || { __data: item }; // element;
      if (elements.length) {
        target[element] =
          typeof target[element] === "object" ? target[element] : {};
        add(elements.join("/"), target[element], item);
      }
    };
    response.items.forEach((item: any) => add(item.path, filesystem, item));
    return filesystem;
  }

  useEffect(() => {
    const getFolder = async () => {
      try {
        const result = await list({
          path: ({ identityId }) => `protected/${identityId}/`,
        });
        if (result) {
          setData(result);
          setFilesystem(processStorageList(result));
          console.log(filesystem);
          console.log(result);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getFolder();
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          {/* {filesystem &&
            filesystem.map((file: any) => {
              <h2>{file}</h2>;
            })} */}

          {/* <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div> */}
          <FileUploader />
          <h2>{user?.username}</h2>
          <h3>Files {data ? "yes" : "no"}</h3>
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
