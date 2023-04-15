import React from 'react'

function PageTitle({title}) {
  return (
    <div className='mt-3' >
        <h2 style={{ 
        fontWeight: 'bold',
          textAlign: 'center'
     }}>{title}</h2>
    </div>
  )
}

export default PageTitle