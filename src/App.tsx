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
import Modal from "./components/Modal";
import BasicModal from "./components/Modal";
import PhotoCard from "./components/Card";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Button } from "@aws-amplify/ui-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [data, setData] = useState<any>([]);
  const [filesystem, setFilesystem] = useState<any>({});
  const [curPhoto, setCurPhoto] = useState<any>(null);
  const [modelOpen, setModalOpen] = useState(false);
  const [uploadModelOpen, setUploadModalOpen] = useState(false);
  const [imageList, setImageList] = useState<any>([]);

  useEffect(() => {
    client.models.Gallery.observeQuery().subscribe({
      next: (data) => setData([...data.items]),
    });
  }, []);

  useEffect(() => {
    const getList = async () => {
      const { data, errors } = await client.models.Gallery.list({
        authMode: "apiKey",
      });
      console.log("list", data);
    };

    getList();
  }, []);

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
        toast.success("Link Copied to Clipboard!");
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
      } catch (e) {
        console.log(e);
      }
    };
    getFolder();
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  const loadPhoto = (path: any) => {
    data.map((item: any) => {
      console.log("item", item);
    });

    const i = data.filter((item: any) => item.path === path);
    console.log(i);
    setCurPhoto(path);
    setModalOpen(true);
    const gallery = {
      name: path.split("/").pop(),
      path: path,
      accessedIndex: 0,
      isCompressed: false,
    };
  };

  return (
    <div className="">
      <Authenticator className="polka">
        {({ signOut, user }) => (
          <main className="main">
            <div className="sidebar">
              <div className="file-uploader">
                <FileUploader />
              </div>
              <span className="logout" onClick={signOut}>
                Logout
              </span>
            </div>
            <div>
              {" "}
              <h5 className="heading">Amplify-Gallery</h5>
              <div className="navbar">
                <Button className="logout">Logout</Button>
              </div>
              {modelOpen && (
                // <div className="photo-modal">
                //   <StorageImage alt="image" path={curPhoto} className="cur-photo" />
                // </div>
                <BasicModal
                  path={curPhoto}
                  modalOpen={modelOpen}
                  setModalOpen={setModalOpen}
                />
              )}
              <div className="image-container">
                {!data && <h2>Loading.....</h2>}
                {data &&
                  data?.map((item: any) => {
                    return (
                      // <PhotoCard path={item.path} />
                      <div
                        className="image"
                        onDoubleClick={() => loadPhoto(item.path)}
                      >
                        {/* <h5 onClick={() => share(item.path)}>Share</h5> */}

                        {/* <PhotoCard path={item.path} /> */}
                        <StorageImage
                          alt="image"
                          path={item.path}
                          className="photo"
                        />
                        <div className="mini-container">
                          <h6>{item.path.split("/").pop()}</h6>
                          <div
                            className="share-icon"
                            onClick={() => share(item.path)}
                          >
                            <SendIcon />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
