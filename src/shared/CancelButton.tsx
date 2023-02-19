import { Button, ButtonProps, styled } from "@mui/material"
import { red } from "@mui/material/colors"

export const cancelBtnWidth = 40

const cancelBtnBackgroundColor = red[500]

const cancelBtnHoverBackgroundColor = red[700]

export const CancelButton = styled(Button)<ButtonProps>(() => ({
  minWidth: cancelBtnWidth,
  maxWidth: cancelBtnWidth,
  backgroundColor: cancelBtnBackgroundColor,
  "& .MuiButton-startIcon": { margin: 0 },
  "&:hover": {
    backgroundColor: cancelBtnHoverBackgroundColor,
  },
}))
