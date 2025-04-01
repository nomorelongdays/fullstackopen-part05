import PropTypes from 'prop-types'

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
      <form name="login form" onSubmit={handleSubmit}>
        <div>
          username:
          <input
            type="text"
            value={username}
            autoComplete="username"
            name="username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            value={password}
            autoComplete="current-password"

            name="password"
            data-testid='password'
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm