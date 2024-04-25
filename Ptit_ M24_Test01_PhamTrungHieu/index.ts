interface Feedback {
  id: number;
  name: string;
  score: number;
}

let feedbacks: Feedback[] = JSON.parse(
  localStorage.getItem("Feedbacks") || "[]"
);

function renderFeedback() {
  let listFeedback = document.getElementById("list-feedback");
  if (!listFeedback) {
    console.error("Hiện chưa có feedback");
    return;
  }
  listFeedback.innerHTML = "";
  feedbacks.forEach((feedback) => {
    let row = `
            <tr>
              <td>${feedback.score}</td>
              <td>${feedback.name}</td>
              <td>
                <button class="btn-edit" onclick="editFeedback(${feedback.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-delete" data-id="${feedback.id}"><i class="fa-solid fa-xmark"></i></button>
              </td>
            </tr>`;
    listFeedback.innerHTML += row;
  });
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      let feedbackId = this.getAttribute("data-id");
      if (!feedbackId) {
        console.error("Không tìm thấy id feedback");
        return;
      }
      deleteFeedback(parseInt(feedbackId));
    });
  });
}

renderFeedback();

function setupPointClickEvent() {
  let pointItems = document.querySelectorAll(".point-evaluation_item");
  pointItems.forEach((item) => {
    item.addEventListener("click", () => {
      pointItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

setupPointClickEvent();

function createFeedback(): void {
  let selectedPoint = document.querySelector(
    ".point-evaluation_item.active"
  ) as HTMLElement;
  let score = selectedPoint
    ? parseFloat(selectedPoint.getAttribute("data-point") || "0")
    : 0;
  let name = (document.getElementById("comment") as HTMLInputElement).value;

  let feedbackNew: Feedback = {
    id: Math.floor(Math.random() * 10000),
    name: name,
    score: score,
  };

  feedbacks.push(feedbackNew);
  localStorage.setItem("Feedbacks", JSON.stringify(feedbacks));
  selectedPoint.classList.remove("active");
  (document.getElementById("comment") as HTMLInputElement).value = ""
  renderFeedback();
}

function deleteFeedback(id: number): void {
  Swal.fire({
    title: "Bạn có chắc muôn xóa?",
    text: "Nếu bạn xóa sẽ không khôi phục lại được",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Vâng, hãy xóa!",
  }).then((result: any) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Phản hồi của bạn đã bị xóa.",
        icon: "success",
      });
      feedbacks = feedbacks.filter((feedback) => feedback.id !== id);
      localStorage.setItem("Feedbacks", JSON.stringify(feedbacks));
      renderFeedback();
    }
  });
}

let submitBtn = document.getElementById("submit") as HTMLElement;
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  createFeedback();
});

// hàm chỉnh sửa
function editFeedback(id: number): void {
    const feedback = feedbacks.find(feedback => feedback.id === id);
    const submitButton = document.getElementById('submit') as HTMLButtonElement;
    if (submitButton) {
        submitButton.innerHTML = 'Update';
        submitButton.removeEventListener('click', createFeedback);
        submitButton.removeEventListener('click', updateFeedback);
        submitButton.addEventListener('click', () => updateFeedback(id));
    }
    if (feedback) {
        let reviewInput = document.getElementById('comment') as HTMLInputElement;
        let pointItems = document.querySelectorAll('.point-evaluation_item');
        reviewInput.value = feedback.name;
        pointItems.forEach(item => {
            if (parseInt(item.getAttribute('data-point') || '0') === feedback.score) {
                item.classList.add('active');
            }
        });
    }
}

function updateFeedback(id: number): void {
    const reviewInput = document.getElementById('comment') as HTMLInputElement;
    const selectedPoint = document.querySelector('.point-evaluation_item.active') as HTMLInputElement;
    const score = selectedPoint ? parseFloat(selectedPoint.getAttribute('data-point') || '0') : 0;

    const updatedFeedback: Feedback = {
        id: id,
        score: score,
        name: reviewInput.value
    };

    const index = feedbacks.findIndex(feedback => feedback.id === id);
    if (index !== -1) {
        const submitButton = document.getElementById('submit') as HTMLButtonElement;
        if (submitButton) {
            submitButton.innerHTML = 'Send';
            submitButton.removeEventListener('click', updateFeedback);
            submitButton.removeEventListener('click', createFeedback);
            submitButton.addEventListener('click', createFeedback);
        }
        feedbacks[index] = updatedFeedback;
        localStorage.setItem('Feedbacks', JSON.stringify(feedbacks));
        selectedPoint.classList.remove("active");
        reviewInput.value = '';
        renderFeedback();
    }
}
