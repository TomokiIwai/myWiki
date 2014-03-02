class TMPLS
{
    public static TaskView  = "\
<% if (isEditing) { %>\
    <input class='name-input' type='text' value='<%= name %>'/>\
    <input class='save-input' type='button' value='save'/>\
    <input class='cancel-input' type='button' value='cancel'/>\
    <input class='delete-input' type='button' value='delete'/>\
<% } else { %>\
    <% if (completed) { %>\
        <input type='checkbox' checked><del><%= name %></del></input>\
    <% } else { %>\
        <input type='checkbox'><%= name %></input>\
    <% } %>\
    \
    <a class='edit-link' href='javascript:void(0);'>[edit]</a>\
<% } %>\
";
}
