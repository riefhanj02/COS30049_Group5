import { StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../constants';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  heroSection: {
    width: '100%',
    height: 100,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  heroText: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
    color: COLORS.white,
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  container: {
    flexGrow: 1,
    padding: SIZES.large,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    marginTop: SIZES.large,
    marginBottom: SIZES.medium,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.white,
  },
  sightingsList: {
    marginVertical: SIZES.large,
  },
  sightingCard: (isEndangered) => ({
    backgroundColor: isEndangered ? COLORS.tertiary : COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  }),
  sightingImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.small,
  },
  sightingDetails: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.secondary,
    marginBottom: SIZES.small,
  },
  sightingTime: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.small,
  },
  detailButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  detailButtonText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  captureButtonText: {
    color: COLORS.white,
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
  },
});

export default styles;
