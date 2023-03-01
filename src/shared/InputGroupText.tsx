import { Box } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import React from "react";

export interface InputGroupTextProps extends BoxProps {
  text: string;
}

export const InputGroupText = React.forwardRef<BoxProps, BoxProps>(function InputGroupText(
  props,
  ref,
) {
  return (
    <Box
      {...props}
      ref={ref}
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
      {props.children}
    </Box>
  );
});
