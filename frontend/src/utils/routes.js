

const BASE_URL="https://doctor-appointment-app-umve.onrender.com"


export const API_ROUTES = {
  LOGIN: `${BASE_URL}/api/user/login`,
  REGISTER: `${BASE_URL}/api/user/register`,
  GET_DOCTORS: `${BASE_URL}/api/doctor/list`,
  GET_User:`${BASE_URL}/api/user/get-profile`,
  UPDATE_PROFILE:`${BASE_URL}/api/user/update-profile`,
  BOOK_APPOINTMENT:`${BASE_URL}/api/user/book-appointment`,
  GET_APPOINTMENTS:`${BASE_URL}/api/user/list-appointment`,
  CANCEL_APPOINTMENT:`${BASE_URL}/api/user/cancel-appointment`,
  PAYMENT_RAZORPAY:`${BASE_URL}/api/user/payment-razorpay`,
  VERIFY_PAYMENT:`${BASE_URL}/api/user/verify-payment`
};