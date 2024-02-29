import MuiLoadingButton, {
  LoadingButtonProps as MuiLoadingButtonProps,
} from "@mui/lab/LoadingButton";
import { Button, ButtonProps, Stack, styled, SxProps, Theme } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const cancelBtnMinWidth = 40;

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
  minWidth: cancelBtnMinWidth,
  backgroundColor: theme.custom.stopButton.backgroundColor,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  boxShadow: "none",
  "& .MuiButton-startIcon": { margin: 0 },
  "&:hover": {
    backgroundColor: theme.custom.stopButton.hoverBackgroundColor,
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
