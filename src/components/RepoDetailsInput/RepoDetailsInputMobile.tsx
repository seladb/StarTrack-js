import { Button, FormGroup, styled, TextField, TextFieldProps } from "@mui/material"
import Typography from "@mui/material/Typography"
import React from "react"
import { CancelButton } from "../../shared/CancelButton"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import RepoDetailsInputProps from "./RepoDetailsInputProps"
import { LoadingButton } from "@mui/lab"
import SaveIcon from "@mui/icons-material/Save"

const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
  marginTop: "2px",
  marginBottom: "2px",
}))

export default function RepoDetailsInputMobile({
  loading,
  onGoClick,
  onCancelClick,
}: RepoDetailsInputProps) {
  const [username, setUsername] = React.useState<string>("")
  const [repo, setRepo] = React.useState<string>("")

  const handleClick = () => {
    onGoClick(username.trim(), repo.trim())
  }

  return (
    <FormGroup>
      <Typography variant="body1" sx={{ margin: "auto", fontWeight: "bold" }}>
        Repo Details
      </Typography>
      <StyledTextField
        value={username}
        size="small"
        placeholder="Username"
        onChange={(e) => {
          setUsername(e.target.value)
        }}
      />
      <StyledTextField
        value={repo}
        size="small"
        placeholder="Repo name"
        onChange={(e) => {
          setRepo(e.target.value)
        }}
      />
      {loading ? (
        <FormGroup sx={{ marginTop: "5px", flexDirection: "row" }}>
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{ flex: 1 }}
          >
            Loading...
          </LoadingButton>
          <CancelButton
            variant="contained"
            onClick={onCancelClick}
            startIcon={<StopCircleIcon />}
          ></CancelButton>
        </FormGroup>
      ) : (
        <Button variant="contained" onClick={handleClick} sx={{ marginTop: "5px" }}>
          Go!
        </Button>
      )}
    </FormGroup>
  )
}
