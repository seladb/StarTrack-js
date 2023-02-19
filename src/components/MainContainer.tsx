import { Container } from "@mui/system";
import React from "react";
import RepoDetailsInput from "./RepoDetailsInput/RepoDetailsInput";

export default function MainContainer() {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <Container sx={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <RepoDetailsInput
        loading={loading}
        onGoClick={() => {
          setLoading(true);
        }}
        onCancelClick={() => {
          setLoading(false);
        }}
      />
    </Container>
  );
}
