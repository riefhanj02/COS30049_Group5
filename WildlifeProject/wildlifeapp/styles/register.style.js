import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT, SIZES } from '../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: SIZES.large,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay for readability
  },
  innerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.large,
    padding: SIZES.large,
    width: '90%',
    maxWidth: 400,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  input: {
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.gray,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.darkGray,
  },
  pickerContainer: {
    borderWidth: 1,
    backgroundColor: COLORS.lightWhite,
    borderColor: COLORS.gray,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  picker: {
    height: 50,
    color: COLORS.darkGray,
  },
  datePickerButton: {
    justifyContent: 'center',
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  registerButtonText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
  },
  loginButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.small,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
  },
  errorMessage: {
    color: COLORS.tertiary,
    fontFamily: FONT.bold,
    textAlign: 'center',
    fontSize: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  successMessage: {
    color: COLORS.success,
    fontFamily: FONT.bold,
    textAlign: 'center',
    fontSize: SIZES.medium,
    marginBottom: SIZES.medium,
  },
});

export default styles;
