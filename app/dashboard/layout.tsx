import React from 'react'

const DashboardLayout = (
    { children }: {
        children: React.ReactNode
    }
) => {
    return (

        <div>
            {children}
            DashboardLayout
        </div>
    )
}

export default DashboardLayout