import { usePathname } from "next/navigation";

const { createContext, useContext, useState } = require("react");

const DashboardContext = createContext(null)

export const DashboardProvider = ({ children }) => {
	const [notif, setNotif] = useState({ color: 'warning', message: '' })
	const currentPath = usePathname()

	const notificationManager = {
	}
	notificationManager.getNotif = () => notif
	notificationManager.clearMessage = () => {
		console.log('clear message')
		setNotif({ color: notif.color, message: '' })
	}
	notificationManager.setMessage = (message, color = 'success') => setNotif({
		color,
		message,
	})

	return (
		<DashboardContext.Provider value={{ 
			currentPath, 
			hasNotif: notif.message.length > 0, 
			notificationManager }}
		>
			{children}
		</DashboardContext.Provider>
	)
}

export const useDashboard = () => {
	return useContext(DashboardContext)
}
