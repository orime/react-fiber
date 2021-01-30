// eslint-disable-next-line import/no-anonymous-default-export
export default {
  type: "div",
  key: null,
  props: {
    id: "A1",
    children: [
      {
        type: "div",
        key: null,
        props: {
          id: "B1",
          children: [
            {
              type: "div",
              key: null,
              props: {
                id: "C1",
              },
            },
            {
              type: "div",
              key: null,
              props: {
                id: "C2",
              },
            },
          ],
        },
      },
      {
        type: "div",
        key: null,
        props: {
          id: "B2",
        },
      },
    ],
  },
}
