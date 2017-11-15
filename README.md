**Live Demo:**

<a href="http://coolshare.com/leili/projects/CustomReduxD3/">A Redux project with D3 and GoogleMap</a>

<p>
<h3>Assignment:</h3>
<pre>

The intent for this project is to demonstrate your thought process in solution development as well as coding style and practices.
Please provide a short document (paragraph or a few) indicating what your thought process was, what you did and didn't do (things you 
might add/improve on if you had all the time in the world), things you see as potential issues with what you implemented... as well as 
the solution itself. Please also try to provide a rough estimate of how much time you spent on the project.

Attached is <a href="http://coolshare.com/leili/projects/annotatedData.geojson">a geojson file</a>. You may reformat/adjust this file as you see fit for the purposes of this project. This file represents 
impaired crashes by neighborhood in the Washington, D.C. area over a five year period (2010-2014). Please use the data in this file to 
create a single page, coherent representation of the data that users can use to understand various angles/depth of the information 
provided.

Requirements:
    <ul><ul>
    <li>Use at least two types of visualization, one of which must be geo-based</li>
    <li>Use the D3.js library for at least one of the visualizations</li>
    <li>Provide interactivity between visualizations as well as user interactivity points</li>
    <li>Provide at least one interaction that allows users to limit/filter/search data</li>
    <li>You may use any third-party libraries you see fit</li>
    <li>Responsive design / mobile compatibility is optional</li>
    </ul></ul>
</pre>
<br/>
<h3>Design and major approaches in this project</h3>
  <li>Architecture.</li>
      This project used the Redux to handle to controlling and modeling working with React view.
      The details is described in one of my other projects (<a href="https://github.com/leileili/Custom_React_Redux">A custom Redux Approach</a>). In this approach, I fixed some issues of Redux and improved the efficiency <br/><br/>
  <li>Major patterns used.</li></br/>
    <b>1).</b> Highly componentized and isolated<br/>
       My application is highly componentized (See my other project, <a href="https://github.com/leileili/independentComponentlize">Highly componentized web application</a>, for details). My application is a container containing highly isolated "Objects" such as components for UI and services. These components and services never have references to each other. They only input by subscribe or connect (Redux) and only output by dispatch (Redux) or publish without any reference to any component or service.<br/><br/>
      <b>2).</b> <a href="http://www.thegreatcodeadventure.com/the-react-plus-redux-container-pattern/">Container Pattern</a>. A typical usage of this pattern is my ContentContainer class. ContentContainer contains two views: TableView and MapD3View. ContentContainer handles all the data flow (mostly incomming), process (filter) and passes the filtered data to views. Views (TableView and MapD3View), as Presentational Components, are stateless and only accept data from properties passed from container (ContentContainer). This pattern will make my life much easier such as testing the views.<br/><br/>
     <b>3).</b> Publish/Subscribe.<br/>
    Communication among components was so important and I liked to design a very easy way to let any component/service to communicate to others in a extreme loose way. Redux provides a subscription method but can not provide what I needed (see why in <a href="https://github.com/leileili/Custom_React_Redux">A custom Redux Approach</a>). This pattern (Publish/Subscribe) satisfies what I needed. I built my own Publish/Subscribe system: CommunicationManager, a singleton that can be access globally. This system seamlessly integrated with Redux so that all the dispatching of Redux can be subscribed so that a dispatch can now not only update the store but also notify any subscriber that can easily determent if the message is for it without checking the store changes.<br/><br/>


Here is the flow chart about how the data is requested:
![Redux D3 workflow](./src/flow.png?raw=true "Redux withD3 workflow Picture")
<h4>The key points in the flow chart above:</h4>
<b>a).</b>The Components and Services are highly isolated. For example, in the flow above, when RemoteService receives data from remote server (4) it has no idea about who will use the data - simply dispatch the response data to a given "type" in the Redux store (5). And ContentContainer also has no idea about who handle its request for data and who eventually update its views. Only thing ContentContainer knows are a topic/type ("/RemoteServices/getAll") to publish. This means that a service consumer (the component) never know who is the service provider. <b>This is a higher level of isolation than dependency injection</b> in Angular since a service consumer (controller in AngularJS or component in Angular) has to specify concretely what service provider to be injected.<br/><br/>

<b>b).</b> There is no code to update the views! The change of "type" (annotatedData) in Redux store causes the views to be updated (7) automatically because of Redux Connect!<br/><br/>


<h4>To be improved/constructed</h4>
<b>1.</b> svg for each annotatedData object is overlapped to each other. So I can not use the polygon to detect mousemove and click. In stead, I detect mousemove and click from GoogleMap and then loop through polygons to find out the target polygon. There should be a better way to detect the mouse event directly from D3 objects.<br/><br/>
<b>2.</b> The boostrap table needs to have pagination and so on.<br/><br/>

