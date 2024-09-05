import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Trip, TripDate } from 'models/Types';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslationWrapper } from 'services/Translation';
import { modalSelector, openModalState } from 'state/modalState';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { emptyTripDate } from 'state/tripState';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface Props {
  trip: Trip;
}

interface TripDateProps {
  date: TripDate;
  updateDate: (updatedDate: TripDate, index: number) => void;
  index: number;
  onRemove: (index: number) => void;
}

const TripDateField = ({ date, updateDate, index, onRemove }: TripDateProps) => {
  const t = useTranslationWrapper();

  const updateStartTime = (startTime: dayjs.Dayjs | null) => {
    startTime && updateDate({ ...date, start_time: startTime }, index);
  };

  const updateEndTime = (endTime: dayjs.Dayjs | null) => {
    endTime && updateDate({ ...date, end_time: endTime }, index);
  };

  return (
    <Box id={'trip-date' + index}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nb">
        <Grid item sx={{ mb: 1 }}>
          <Typography variant="h4">{t('common.date') + ' ' + index}</Typography>
        </Grid>
        <Grid item sx={{ mb: 2 }}>
          <DatePicker
            label={t('common.start_time')}
            value={date.start_time}
            onChange={(e) => updateStartTime(e)}
          />
        </Grid>
        <Grid item>
          <DatePicker
            label={t('common.end_time')}
            value={date.end_time}
            onChange={(e) => updateEndTime(e)}
          />
        </Grid>
      </LocalizationProvider>
      <IconButton aria-label="Remove date" onClick={() => onRemove(index)} disabled={false}>
        <DeleteForeverIcon />
      </IconButton>
      <Divider />
    </Box>
  );
};

export const EditTrip = ({ trip }: Props) => {
  const t = useTranslationWrapper();

  const setOpen = useSetRecoilState(openModalState);
  const [name, setName] = useState<string>(trip.name);
  const [privacy, setPrivacyNote] = useState<boolean>(trip.private);
  const [dates, setDates] = useState<TripDate[]>(trip.dates);

  const addDate = async () => {
    setDates([...dates, emptyTripDate]);
  };

  const removeDate = async (index: number) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const updateDate = async (updatedDate: TripDate, index: number) => {
    const datesCopy = [...dates];
    datesCopy[index] = updatedDate;
    setDates(datesCopy);
  };

  const updateTrip = async () => {
    console.debug(trip.id);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Edit trip {trip.id}: {trip.name}
        </Typography>
      </Grid>
      <Grid>
        <TextField
          id="outlined-basic"
          label={t('common.name')}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e?.target.value)}
        />
      </Grid>
      <Grid item id="dates">
        <Typography variant="h3" sx={{ mt: 2 }}>
          {t('common.dates')}
        </Typography>
        {dates.map((date, index) => (
          // Add a button to select the date
          <Grid item key={index} sx={{ mb: 1 }}>
            <TripDateField
              date={date}
              updateDate={updateDate}
              index={index}
              onRemove={removeDate}
            />
          </Grid>
        ))}
        <IconButton aria-label="add" color="primary" sx={{ mt: 0.5 }} onClick={() => addDate()}>
          <AddIcon />
        </IconButton>
      </Grid>
      {/* <Grid>
            <TextField
              multiline
              fullWidth
              rows={5}
              id="outlined-basic"
              label={t('common.content')}
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e?.target.value)}
            />
          </Grid> */}
      <Grid>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{t('common.private')}</Typography>
          <Switch value={privacy} onChange={() => setPrivacyNote(!privacy)} />
          <Typography>{t('common.public')}</Typography>
        </Stack>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid>
          <Button variant="outlined" color="warning" onClick={() => setOpen(modalSelector.NONE)}>
            {t('common.cancel')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="success" onClick={() => updateTrip()}>
            {t('common.save')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};