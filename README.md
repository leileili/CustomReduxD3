***The major approaches in this project***<br/><br/>
**Live Demo:**

<a href="http://coolshare.com/leili/projects/CustomReduxD3/">A Redux project with D3 and GoogleMap</a>

<p>

  <li>Architecture.<br/>
      This project used the Redux to handle to controlling and modeling working with React view.
      The details is described in one of my other projects (<a href="https://github.com/leileili/Custom_React_Redux">A custom Redux Approach</a>). In this approach, I fixed some issues of Redux and improved the efficiency <br/><br/>
  <li>Major patterns used.<br/><br/>
    <b>1).</b> Highly componentized and isolated<br/>
       My application is highly componentized (See my other project, <a href="https://github.com/leileili/independentComponentlize">Highly componentized web application</a>, for details). My application is a container containing highly isolated "Objects" such as components for UI and services. These components and services never have references to each other. They only input by subscribe or connect (Redux) and only output by dispatch (Redux) or publish without any reference to any component or service.<br/><br/>
      <b>2).</b> <a href="http://www.thegreatcodeadventure.com/the-react-plus-redux-container-pattern/">Container Pattern</a>. A typical usage of this pattern is my ContentContainer class. ContentContainer contains two views: TableView and MapD3View. ContentContainer handles all the data flow (mostly incomming), process (filter) and passes the filtered data to views. Views (TableView and MapD3View), as Presentational Components, are stateless and only accept data from properties passed from container (ContentContainer). This pattern will make my life much easier such as testing the views.<br/><br/>
     <b>3).</b> Publish/Subscribe.<br/>
    Communication among components was so important and I liked to design a very easy way to let any component/service to communicate to others in a extreme loose way. Redux provides a subscription method but can not provide what I needed (see why in <a href="https://github.com/leileili/Custom_React_Redux">A custom Redux Approach</a>). This pattern (Publish/Subscribe) satisfies what I needed. I built my own Publish/Subscribe system: CommunicationManager, a singleton that can be access globally. This system seamlessly integrated with Redux so that all the dispatching of Redux can be subscribed so that a dispatch can now not only update the store but also notify any subscriber that can easily determent if the message is for it without checking the store changes.<br/><br/>


Here is the flow chart:
![Redux D3 workflow](./flow.png?raw=true "Redux withD3 workflow Picture")
