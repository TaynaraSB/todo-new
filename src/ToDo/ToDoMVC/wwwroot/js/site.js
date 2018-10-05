﻿// Write your JavaScript code.
$(document).ready(function () {
    $('#add-item-button').on('click', addItem());
    $('.done').on('click', markDone);
    $('.edit').on('click', editItem);
    $('.delete').on('click', deleteItem);

    var postError = (function () {
        var $itemError = $('#add-item-error');
        function erroOnPost(data) {
            var error = data.statusText;
            if (data.responseJSON) {
                var key = Object.keys(data.responseJSON)[0];
                error = data.responseJSON[key];
            }
            $itemError.text(error).show;
        }
        return {
            hide: () => $itemError.hide(),
            onError: erroOnPost
        };

    })();
    function addItem() {
        var newTitle = $('#add-item-title');
        var newDueAt = $('#add-item-due-at');
        return function () {
            postError.hide();
            $.post(
                '/ToDo/AddItem',
                { title: newTitle.val(), dueAt: newDueAt.val() },
                () => window.location = '/ToDo'
            ).fail(postError.onError);
        };
    }

    function markDone(ev) {
        ev.target.disabled = true;
        postError.hide();
        $.post('/ToDo/MarkDone',
            { id: ev.target.name },
            function () {
                var row = ev.target
                    .parentElement.parentElement;
                row.classList.add('done');
            }
        ).fail(postError.onError);
    }

    function editItem(ev) {
        ev.target.disabled = true;
        postError.hide();

        $("#edit-item-modal").modal('show');

        $.post('/ToDo/GetItem', {
            id: ev.target.name
        },
            function (item) {
                $("#edit-item-title").val(item.title);
                $("#edit-item-due-at").val(item.dueAt);
                $("#edit-item-id").val(item.id);
                $("#edit-item-modal").modal('show');
            }
        ).fail(postError.onError);
    }

    function deleteItem() {

    }

});