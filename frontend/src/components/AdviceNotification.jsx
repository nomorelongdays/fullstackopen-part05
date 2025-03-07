const AdviceNotification = ({ message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="advice">
      {message}
    </div>
  )
}


 export default AdviceNotification