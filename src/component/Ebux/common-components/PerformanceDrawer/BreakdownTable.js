import Table from "./Table";

const BreakDownTable = () => {
  const tableData = {
    header: [
      {
        label: "Date",
        value: "date",
        isSortable: {
          value: "date",
          order: 1,
        },
      },
      {
        label: "OSA",
        value: "osa",
        isSortable: {
          value: "osa",
          order: 1,
        },
      },
      {
        label: "Organic Sales",
        value: "organicSales",
        isSortable: {
          value: "organicSales",
          order: 1,
        },
      },
      {
        label: "Media Sales",
        value: "mediaSales",
        isSortable: {
          value: "mediaSales",
          order: 1,
        },
      },
      {
        label: "Organic Order",
        value: "organicOrder",
        isSortable: {
          value: "organicOrder",
          order: 1,
        },
      },
      {
        label: "Media Order",
        value: "mediaOrder",
        isSortable: {
          value: "mediaOrder",
          order: 1,
        },
      },
    ],
    content: [
      {
        date: "15-4-2024",
        osa: "70%",
        organicSales: "70%",
        mediaSales: "70%",
        organicOrder: "70%",
        mediaOrder: "70%",
      },
      {
        date: "15-4-2024",
        osa: "60%",
        organicSales: "60%",
        mediaSales: "60%",
        organicOrder: "70%",
        mediaOrder: "70%",
      },
      {
        date: "16-4-2024",
        osa: "50%",
        organicSales: "50%",
        mediaSales: "50%",
        organicOrder: "70%",
        mediaOrder: "70%",
      },
      {
        date: "17-4-2024",
        osa: "40%",
        organicSales: "40%",
        mediaSales: "40%",
        organicOrder: "70%",
        mediaOrder: "70%",
      },
      {
        date: "17-4-2024",
        osa: "40%",
        organicSales: "40%",
        mediaSales: "40%",
        organicOrder: "70%",
        mediaOrder: "70%",
      },
      {
        date: "17-4-2024",
        osa: "40%",
        organicSales: "40%",
        mediaSales: "40%",
        organicOrder: "70%",
        mediaOrder: "70%",
      },
    ],
    footer: [
      {
        label: "Total Days",
        value: "1,050",
      },
      {
        label: "Average OSA Search",
        value: "1,050",
      },
      {
        label: "Total Days",
        value: "1,050",
      },
      {
        label: "Average OSA Search",
        value: "1,050",
      },
      {
        label: "Average OSA Search",
        value: "1,050",
      },
      {
        label: "Average OSA Search",
        value: "1,050",
      },
    ],
  };
  return (
    <>
      <Table tableData={tableData} header="Amazon OSA Breakdown" />
    </>
  );
};
export default BreakDownTable;
