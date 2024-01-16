import { Box, Chip, Typography } from '@mui/material';
import { TripLists } from './TripLists';
import { TripParticipants } from './TripParticipants';
import { TripRoutes } from './TripRoutes';
import { TripDates } from './TripDates';
import { TripNotes } from './TripNotes';
import { useTranslationWrapper } from 'services/Translation';
import { PrivacyToggle } from '../PrivacyToggle';
import { TripDate } from 'models/Types';
import dayjs from 'dayjs';
import { useEditTripState } from './useEditTripState';

const getSelectedDateString = (dates: TripDate[]) => {
  const selected = dates.find((d) => d.selected);
  const startTime = dayjs(selected?.start_time);
  const endTime = dayjs(selected?.end_time);

  return selected !== undefined
    ? `${startTime.format('DD/MM/YYYY')} - ${endTime.format('DD/MM/YYYY')}`
    : 'No date selected';
};

export const TripDetail = () => {
  const { editTripState, setEditTripState } = useEditTripState();
  const t = useTranslationWrapper();

  return editTripState ? (
    <Box marginTop={5} marginLeft={5}>
      <Typography component="h1" variant="h4">
        {editTripState.name}
      </Typography>
      <Typography component="h2" variant="h5">
        Date: {getSelectedDateString(editTripState.dates)}
      </Typography>
      <Chip
        color={editTripState.private ? 'success' : 'warning'}
        size="small"
        label={editTripState.private ? t('common.private') : t('common.public')}
        sx={{ mb: '15px' }}
      />
      {editTripState && <PrivacyToggle trip={editTripState} setTrip={setEditTripState} />}
      <TripParticipants />
      <TripDates />
      <TripRoutes />
      <TripLists />
      <TripNotes />
    </Box>
  ) : null;
};
