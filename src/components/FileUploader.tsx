import { StorageManager } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

export const FileUploader = () => {
  const client = generateClient<Schema>();

  const afterUpload = async (key: any) => {
    try {
      const res = client.models.Gallery.create(
        {
          name: key.split("/").pop(),
          path: key,
          accessedIndex: 0,
          isCompressed: false,
        },
        {
          authMode: "userPool",
        }
      );
      console.log(res);

      console.log("done uploading");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <StorageManager
      acceptedFileTypes={["image/*"]}
      path={({ identityId }) => `protected/${identityId}/`}
      maxFileCount={1}
      isResumable
      onUploadSuccess={({ key }) => afterUpload(key)}
      onUploadStart={() => console.log("uploading")}
      maxFileSize={10000000}
    />
  );
};
