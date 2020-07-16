import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [attendees, setAttendees] = useState([]);
  const [allAttendeesCopy, setAllattendeesCopy] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allAttendees, setAllattendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState('All users');
  const [speakers, setSpeakers] = useState([]);
  const [searchValue, setsearchValue] = useState('');
  const [user, setUser] = useState([]);

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    axios
      .get('/auth/verify-token')
      .then(async (response) => {
        console.log('RESPONSE DATA', response.data);
        setAuth(true);
        setUser(response.data);
      })
      .then(() => {
        console.log('UNIQUE NAME ', user);
      })
      .catch(() => setAuth(false));
    /////???/////
    getAllAttendees();
    getAllSpeakers();
    getAllUsers();
    /////???/////
  }, []);

  const getAllSpeakers = () => {
    axios
      .get('/users/speakers')
      .then((response) => response.data)
      .then((speakersList) => {
        setSpeakers(speakersList);
        console.log('speakers', speakersList);
      });
  };

  const getAllAttendees = () => {
    axios
      .get('/users/attendees')
      .then((response) => response.data)
      .then((attendeesList) => {
        setAllattendees(attendeesList);
        console.log('attendees', attendeesList);
      });
  };

  const getAllUsers = () => {
    axios
      .get('/users')
      .then((response) => response.data)
      .then((allUsersList) => {
        setUsers(allUsersList);
        setAllUsers(allUsersList);
      });
  };

  const setUserInformation = ({ user, token }) => {
    setUser(user);
    window.localStorage.setItem('userRole', user.role);
  };

  const logout = () => {
    axios.post('/auth/logout');
    window.localStorage.removeItem('userRole');
  };

  const handleFilterUser = (event) => {
    const role = event.target.value;

    switch (role) {
      case 'All users':
        setFilterUser(role);
        setUsers(allUsers);
        break;
      case 'Attendees':
        setFilterUser(role);
        setUsers(allAttendees);
        break;
      case 'Speakers':
        setFilterUser(role);
        setUsers(speakers);
        break;
    }
  };

  const handleChangeSearch = (event) => {
    const { value } = event.target;
    if (value.length) {
      const filteredUsers = allUsers.filter((user) => {
        const name = `${user.firstname} ${user.lastname}`;
        return name.toLowerCase().includes(value.toLowerCase());
      });
      setsearchValue(value);
      setUsers(filteredUsers);
    } else {
      setsearchValue(value);
      setUsers(allUsers);
    }
  };

  const deleteUser = (id, role) => {
    if (role == 'speaker') {
      console.log('deleteUser', id, role);
      axios.delete(`/workshops/all-speaker-workshops/${id}`).then(() => {
        axios.delete(`/workshops/speaker/${id}`).then(() => {
          axios.delete(`/users/${id}`).then(() => {
            getAllUsers();
          });
        });
      });
    }
    if (role == 'attendee') {
      axios.delete(`/workshops/all-user-workshops/${id}`).then(() => {
        axios.delete(`/users/${id}`).then(() => {
          getAllUsers();
        });
      });
    }
    axios.delete(`/users/${id}`);

    getAllUsers();
  };

  return (
    <div>
      <UserContext.Provider
        value={{
          users,
          attendees,
          allAttendees,
          handleFilterUser,
          filterUser,
          speakers,
          allUsers,
          searchValue,
          handleChangeSearch,
          deleteUser,
          user,
          setUserInformation,
          getAllSpeakers,
          logout,
          auth,
          setAuth,
        }}>
        {props.children}
      </UserContext.Provider>
    </div>
  );
};

export default UserContextProvider;
