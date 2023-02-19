import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { IconButton, Tooltip } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import { StorageType } from "../../utils/GitHubUtils"
import { useState } from "react"

interface GitHubTokenProps {
  accessToken: string
  storageType: StorageType
}
export default function GitHubToken({ accessToken, storageType }: GitHubTokenProps) {
  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false)

  const accessTokenShort = accessToken.slice(-6)

  return smallScreen ? (
    <IconButton color="inherit" onClick={() => setTooltipIsOpen(!tooltipIsOpen)}>
      <Tooltip
        open={tooltipIsOpen}
        title={`Access token '${accessTokenShort}' stored in ${storageType}`}
        arrow
      >
        <KeyIcon />
      </Tooltip>
    </IconButton>
  ) : (
    <>
      <KeyIcon sx={{ m: 1 }} />
      <Tooltip title={`Access token stored in ${storageType}`} arrow>
        <p>{accessTokenShort}</p>
      </Tooltip>
    </>
  )
}
