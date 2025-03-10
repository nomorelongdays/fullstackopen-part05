const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
 }) => {
  return (
    <div>
      <div></div>
      <form onSubmit={handleSubmit}>
        <div>
          username: 
            <input
            type="text"
            value={username}
            autoComplete="username"
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password:
            <input
            type="password"
            value={password}
            autoComplete="current-password"
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm