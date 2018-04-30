const inputWidth = 300

export default (theme) => {
  return {
    root: {
      padding: '60px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      width: inputWidth,
      marginBottom: 20,
    },
    loginButton: {
      width: inputWidth,
      backgroundColor: theme.palette.primary[500],
      color: '#fff',
    },
  }
}
