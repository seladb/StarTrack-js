import { Box } from "@mui/material"

export interface InputGroupTextProps {
  text: string
}

export default function InputGroupText({ text }: InputGroupTextProps) {
  return (
    <Box
      component="div"
      sx={{
        display: "inline",
        p: 1,
        m: 1,
        bgcolor: (theme) => theme.palette.grey[300],
        color: (theme) => theme.palette.grey[800],
        border: "1px solid",
        borderColor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.300"),
        borderRadius: 1,
        fontSize: "0.875rem",
        fontWeight: "700",
        margin: 0,
      }}
    >
      {text}
    </Box>
  )
}
