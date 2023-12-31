import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Select,
  MenuItem,
  Grid,
  DialogContentText,
} from "@mui/material";
import { ForecastInfo } from "./ForecastInfo";
import { useFormik } from "formik";
import * as yup from "yup";

const defaultTimeCountValue = 3;
const defaultTimeUnitValue = "months";
const defaultPointCount = 100;
const maxTimeCountValue = 100;
const maxPointCount = 500;

interface ForecastFormProps {
  open: boolean;
  onClose: (forecastProps: ForecastInfo | null) => void;
  initialValues: ForecastInfo | null;
}

export default function ForecastForm({ open, onClose, initialValues }: ForecastFormProps) {
  const validationSchema = yup.object({
    backwardCount: yup
      .number()
      .min(1, "Must be greater than 0")
      .max(maxTimeCountValue, `Must be ${maxTimeCountValue} or less`)
      .required("Value required"),
    forwardCount: yup
      .number()
      .min(1, "Must be greater than 0")
      .max(maxTimeCountValue, `Must be ${maxTimeCountValue} or less`)
      .required("Value required"),
    pointCount: yup
      .number()
      .min(1, "Must be greater than 0")
      .max(maxPointCount, `Must be ${maxPointCount} or less`)
      .required("Value required"),
  });

  const formik = useFormik({
    initialValues: {
      backwardCount: initialValues?.timeBackward.count ?? defaultTimeCountValue,
      backwardUnit: initialValues?.timeBackward.unit ?? defaultTimeUnitValue,
      forwardCount: initialValues?.timeForward.count ?? defaultTimeCountValue,
      forwardUnit: initialValues?.timeForward.unit ?? defaultTimeUnitValue,
      pointCount: initialValues?.pointCount ?? defaultPointCount,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onClose({
        timeBackward: { count: values.backwardCount, unit: values.backwardUnit },
        timeForward: { count: values.forwardCount, unit: values.forwardUnit },
        pointCount: values.pointCount,
      });
    },
  });

  const handleClose = () => {
    onClose(null);
  };

  return (
    <Dialog open={open} maxWidth="sm">
      <DialogTitle>Forecast Properties</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DialogContentText>Display forecast based on the last</DialogContentText>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="backwardCount"
                name="backwardCount"
                inputProps={{ "data-testid": "backwardCount" }}
                value={formik.values.backwardCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.backwardCount && Boolean(formik.errors.backwardCount)}
                helperText={formik.touched.backwardCount && formik.errors.backwardCount}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                id="backwardUnit"
                name="backwardUnit"
                inputProps={{ "data-testid": "backwardUnit" }}
                value={formik.values.backwardUnit}
                onChange={formik.handleChange}
              >
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="years">Years</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <DialogContentText>Display forecast ahead</DialogContentText>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="forwardCount"
                name="forwardCount"
                inputProps={{ "data-testid": "forwardCount" }}
                value={formik.values.forwardCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.forwardCount && Boolean(formik.errors.forwardCount)}
                helperText={formik.touched.forwardCount && formik.errors.forwardCount}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                id="forwardUnit"
                name="forwardUnit"
                inputProps={{ "data-testid": "forwardUnit" }}
                value={formik.values.forwardUnit}
                onChange={formik.handleChange}
              >
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="years">Years</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <DialogContentText>Number of values to calculate</DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                id="pointCount"
                name="pointCount"
                inputProps={{ "data-testid": "pointCount" }}
                value={formik.values.pointCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pointCount && Boolean(formik.errors.pointCount)}
                helperText={formik.touched.pointCount && formik.errors.pointCount}
              />
            </Grid>
            <Grid item xs={12}>
              <DialogContentText>
                The forecast is based on{" "}
                <a href="https://en.wikipedia.org/wiki/Linear_least_squares">
                  Linear Least Squares
                </a>{" "}
                which creates a regression line from the existing stargazer data and extends this
                line into the future
              </DialogContentText>
            </Grid>
          </Grid>
          <DialogActions>
            <Button type="button" className="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Ok</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
