import React, { useContext, useState, useEffect } from 'react';
import NotificationsList from './AllNotificationsSubComponents/NotificationsList';
import Filters from '../SharedComponents/Filters'
import { Link } from 'react-router-dom';
import './AllNotifications.scss'
import { NotificationContext } from '../../Context/NotificationContext';
import ModalForm from './Modals/ModalForm';


const AllNotifications = () => {

    const { notifications, handleFilterState, stateFilter, handleNotificationSearch, searchNotificationValue, deleteNotification, confirmedAll } = useContext(NotificationContext)


    useEffect(() => {
        if(confirmedAll){
          toggleDisplayModal("message", "Notifications successfully added!")
        }
      },[confirmedAll])


    const [displayModal, setDisplayModal] = useState(false);
    const [notification, setNotification] = useState(false);
    const [active, setActive] = useState("");
    const [content, setContent] = useState("");
    const [NotificationId, setNotificationId] = useState("");

    const toggleDisplayModal = (activeModal, modalContent, notification_id, selectedNotification) => {
        setNotificationId(notification_id)
        setContent(modalContent)
        setActive(activeModal)
        setDisplayModal(!displayModal)
        setNotification(selectedNotification)
        if(activeModal === "message"){
            setDisplayModal(true);
            setTimeout(() => setDisplayModal(false), 1500);
          }

    }


    const state = [{ state: "scheduled" }, { state: "sent"} ]
    return ( 
        <div>
            <div className="all-notifications-header">
                <h1>All Notifications</h1>
                <button className="new-notification-btn"><Link to='/admin/new-notification'>New Notification</Link></button>
            </div>
            {displayModal && <ModalForm active={active} toggleDisplayModal={toggleDisplayModal} notification={notification} content={content} confirmFunction={deleteNotification} confirmText="Delete" id={NotificationId} />}
            <div className="all-notifications-body">
                <Filters handleSearch={handleNotificationSearch} seachValue={searchNotificationValue} optionsList={state} handleOption={handleFilterState} defaultOption="All notifications" optionKey="state" optionValue={stateFilter} />
                <NotificationsList notifications={notifications} toggleDisplayModal={toggleDisplayModal} />
            </div>
        </div>
     );
}
 
export default AllNotifications;