import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import { FileUploader } from "./components/FileUploader";
import { list } from "aws-amplify/storage";
import { IdentitySource } from "aws-cdk-lib/aws-apigateway";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { getUrl } from "aws-amplify/storage";
import "./App.css";
import "./css/tailwind.src.css";

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
    setFilesystem(filesystem);
    if (filesystem) console.log("filesystem", filesystem);
    return filesystem;
  }
  function copyText(text: any) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // alert(`Text copied to clipboard ${text}`);
        console.log("Text copied to clipboard:", text);
      })
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
      });
  }

  const share = async (path: any) => {
    const linkToStorageFile = await getUrl({
      path,
      // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
      // options: {
      //   validateObjectExistence?: false,  // defaults to false
      //   expiresIn?: 20 // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)

      // },
    });
    copyText(linkToStorageFile.url.href);
  };

  useEffect(() => {
    const getFolder = async () => {
      try {
        const result = await list({
          path: ({ identityId }) => `protected/${identityId}/`,
        });

        await setData(result.items);
        console.log("data", data);
        // if (result) {
        //   setData(result.items);
        //   processStorageList(result);
        //   console.log("result", result);
        //   console.log("data", data);
        // }
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
          <h2 className="text-xs text-[#ffffff]">Amplify-Gallery</h2>
          {}
          <div className="image-container">
            {data &&
              data?.map((item: any) => {
                return (
                  <div className="image">
                    <h5 onClick={() => share(item.path)}>Share</h5>
                    <StorageImage alt="image" path={item.path} />
                    <h6>{item.path.split("/").pop()}</h6>
                  </div>
                );
              })}
          </div>
          {/* {data && data?.items.map((item: any) => {})} */}
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
