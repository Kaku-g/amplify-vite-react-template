import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import Skeleton from "@mui/material/Skeleton";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ path, modalOpen, setModalOpen }: any) {
  console.log("path", path);
  const [open, setOpen] = React.useState(modalOpen);
  const handleOpen = () => setOpen(modalOpen);
  const [loading, setLoading] = React.useState(true);
  const handleClose = () => {
    console.log("close hit");
    setModalOpen(!modalOpen);
    setOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading && <Skeleton animation="wave" height={100} width="100%" />}
          {
            <StorageImage
              alt="image"
              path={path}
              className="cur-photo"
              onLoad={() => setLoading(false)}
            />
          }

          <Typography id="modal-modal-title" variant="h6" component="h2">
            {path.split("/").pop()}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
