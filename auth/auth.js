function Auth() {
  let admin = localStorage.getItem("token");
  if (!admin) {
    return false;
  }
  return true;
}
export default Auth;
