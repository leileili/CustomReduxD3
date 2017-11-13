***The major approaches in this project***<br/><br/>
**Live Demo:**

<a href="http://coolshare.com/leili/CustomRedux/">Custom React Redux Demo</a>

<p>

  <li>Architecture.<br/>
      This project used the Redux to handle to controlling and modeling working with React view.
      The details is described in one of my other projects (<a href="https://github.com/leileili/Custom_React_Redux">A custom Redux Approach</a>). In this approach, I fixed some issues of Redux and improved the efficiency <br/>
  <li>Major patterns used.<br/>
      1). <a href="http://www.thegreatcodeadventure.com/the-react-plus-redux-container-pattern/">Container Pattern</a>. A typical usage of this pattern is my ContentContainer class. ContentContainer contains two views: TableView and MapD3View. ContentContainer handles all the data flow (mostly incomming) and passes the filtered data to views. Views (TableView and MapD3View), as Presentational Component,  are stateless and only accept data from properties passed from container (ContentContainer). 


