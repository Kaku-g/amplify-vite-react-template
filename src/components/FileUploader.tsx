import { StorageManager } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";

export const FileUploader = () => {
  return (
    <StorageManager
      acceptedFileTypes={["image/*"]}
      path={({ identityId }) => `protected/${identityId}/`}
      maxFileCount={1}
      isResumable
    />
  );
};
