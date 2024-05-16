'use client'
import Script from 'next/script'

const WaitingList = ({ list_id, widget_type = "WIDGET_1" }: { list_id: string, widget_type?: string }) => {
	return (
		<>
			<div id="getWaitlistContainer"
				className='flex flex-col items-center space-y-2 space-y-4 px-4 py-4 text-center md:px-6'
				data-waitlist_id={list_id} data-widget_type={widget_type}></div>
			<link rel="stylesheet" type="text/css" href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css" />
			<Script src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js" />
		</>

	)
}

export default WaitingList
