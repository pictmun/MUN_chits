### **User Stories for Delegate**

1. **Login**

   - As a Delegate, I want to log in using my assigned committee, portfolio, and password so that I can access the app.

2. **Send Chit**

   - As a Delegate, I want to compose a new chit message, select a recipient delegate, and choose to send it either directly or via EB so that my message reaches the intended person according to the rules.

3. **View Inbox**

   - As a Delegate, I want to see an inbox of received chits so that I can easily view all chits sent to me.

4. **View Sent Chits**

   - As a Delegate, I want to see a list of all the chits I have sent so that I can track my communication history.

5. **Receive Real-Time Notifications**

   - As a Delegate, I want to be notified in real-time when I receive a new chit so that I can respond promptly.

6. **View Previous Chits**
   - As a Delegate, I want to be able to open and view previous chits in my inbox so that I have a record of past messages for reference.

---

### **User Stories for EB (Executive Board)**

1. **Login**

   - As an EB member, I want to log in using my credentials so that I can access the chits requiring approval.

2. **View Pending Chits**

   - As an EB member, I want to see a list of chits that have been routed via EB and require my approval so that I can review and decide on them.

3. **Approve or Reject Chit**

   - As an EB member, I want to be able to approve or reject a chit routed to me so that only appropriate messages are passed on to delegates.

4. **Receive Real-Time Updates on Chits**

   - As an EB member, I want to receive real-time updates on new chits requiring my approval so that I can manage them promptly.

5. **Access Approved Chits History**
   - As an EB member, I want to view a history of chits that have been routed through and approved by me so that I have a record of all reviewed messages.

---

### **User Stories for Admin**

1. **Login**

   - As an Admin, I want to log in with admin credentials so that I can manage the delegates and EB members.

2. **Add New Users**

   - As an Admin, I want to add new delegates and EB members with their committee, portfolio, and password so that they can access the system.

3. **Edit User Information**

   - As an Admin, I want to edit user information, such as portfolio or password, in case corrections or updates are needed.

4. **Delete Users**
   - As an Admin, I want to remove users from the system if they are no longer participating in the event.

---

### **System/Technical User Stories**

1. **Authenticate User**

   - As a System, I want to authenticate users with JWT tokens so that I can secure access to different roles.

2. **Send Real-Time Notifications**

   - As a System, I want to send real-time notifications via WebSocket to delegates and EB members when new chits are sent or require approval so that they are aware of updates instantly.

3. **Role-Based Access Control**
   - As a System, I want to control access based on roles (Delegate, EB, Admin) so that users can only see and perform actions relevant to their role.

---
