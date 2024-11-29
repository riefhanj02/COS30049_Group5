import { StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../constants';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white background
    padding: SIZES.large,
    borderRadius: SIZES.medium,
    width: '90%',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTitle: {
    fontSize: SIZES.xxxLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  input: {
    backgroundColor: COLORS.white,
    width: '100%',
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  commentsInput: {
    height: 100,
    textAlignVertical: 'top', // Makes the text start at the top for multiline input
  },
  donateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    marginVertical: SIZES.small,
    width: '100%',
  },
  donateButtonText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  successMessage: {
    color: COLORS.success,
    textAlign: 'center',
    marginVertical: SIZES.small,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
  },
  errorMessage: {
    color: COLORS.error,
    textAlign: 'center',
    marginVertical: SIZES.small,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
  },
  loadingIndicatorColor: {
    color: COLORS.primary,
  },
});

export default styles;
