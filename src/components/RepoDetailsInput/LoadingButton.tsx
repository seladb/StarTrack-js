import MuiLoadingButton, {
  LoadingButtonProps as MuiLoadingButtonProps,
} from "@mui/lab/LoadingButton";
import { Button, ButtonProps, Stack, styled, SxProps, Theme } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { red } from "@mui/material/colors";

const cancelBtnBackgroundColor = red[500];
const cancelBtnHoverBackgroundColor = red[700];
const cancelBtnMinWidth = 40;

const CancelButton = styled(Button)<ButtonProps>(() => ({
  minWidth: cancelBtnMinWidth,
  backgroundColor: cancelBtnBackgroundColor,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  boxShadow: "none",
  "& .MuiButton-startIcon": { margin: 0 },
  "&:hover": {
    backgroundColor: cancelBtnHoverBackgroundColor,
  },
}));

const InternalLoadingButton = styled(MuiLoadingButton)<MuiLoadingButtonProps>(() => ({
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
}));

interface LoadingButtonProps {
  loading: boolean;
  onGoClick: () => void;
  onCancelClick: () => void;
  sx?: SxProps<Theme>;
}

export default function LoadingButton({
  loading,
  onGoClick,
  onCancelClick,
  sx,
}: LoadingButtonProps) {
  const handleGoClick = () => {
    onGoClick();
  };

  const handleCancelClick = () => {
    onCancelClick();
  };

  return loading ? (
    <Stack direction="row" sx={sx}>
      <InternalLoadingButton
        loading
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        sx={{ width: "80%" }}
      >
        Loading...
      </InternalLoadingButton>
      <CancelButton
        variant="contained"
        onClick={handleCancelClick}
        startIcon={<StopCircleIcon />}
        sx={{ width: "20%" }}
      />
    </Stack>
  ) : (
    <Button variant="contained" onClick={handleGoClick} sx={sx}>
      Go!
    </Button>
  );
}
