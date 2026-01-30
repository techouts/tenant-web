const redirectWithPayload = (url: string, data: any) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.id = "redirectForm";

  Object?.entries(data)?.forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key as string;
    input.value = value as string;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export default redirectWithPayload;
