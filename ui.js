window.onload = function () {
    const convDiv = document.getElementById('conversation');
    const input = document.getElementById('input');
    document.onkeyup = async function (ev) {
        if (ev.key === 'Enter') {
            convDiv.innerHTML += `<div class="msg msg_user"> ${input.value} </div>
            <div class="msg msg_sc"> ${await reply(input.value)}`
            input.value = '';
        }
    }
}