// import React, { useEffect, useRef, useState } from "react";
// import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
// import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";

// const normalizeDefaultChecked = (input) => {
//   if (Array.isArray(input)) {
//     const obj = {};
//     input.forEach((item) => {
//       if (item?.label) {
//         obj[item.label] = true; // 👈 use label (pincode) as key
//       }
//     });
//     return obj;
//   }
//   return input || {};
// };

// const TreeCheckbox = ({
//   data,
//   expanded,
//   onToggle,
//   onSelectionChange,
// //   defaultChecked,
//   expandedItems,
//   setExpandedItems,
//   searchTerm,
// }) => {
//   const { updateSelectedFilters,selectedFilters } = useEbuxContext();

//   const [checkedItems, setCheckedItems] = useState(
//     normalizeDefaultChecked(selectedFilters?.selectedLocation)
//   );

//   // 🔄 Update when defaultChecked changes (modal reopen)
//   useEffect(() => {
//     setCheckedItems(normalizeDefaultChecked(selectedFilters?.selectedLocation));
//   }, [selectedFilters?.selectedLocation]);

//   // 🔍 Expand on search
//   useEffect(() => {
//     if (searchTerm) {
//       const newExpanded = { ...expandedItems };

//       const findAndExpandParents = (nodes, targetValue) => {
//         const findParent = (nodeList, value, parent = null) => {
//           for (const node of nodeList) {
//             if (node.label === value) return parent;
//             if (node.children) {
//               const result = findParent(node.children, value, node);
//               if (result) return result;
//             }
//           }
//           return null;
//         };

//         let current = findParent(data, targetValue);
//         while (current) {
//           newExpanded[current.label] = true;
//           current = findParent(data, current.label);
//         }
//       };

//       const expandRecursive = (nodeList) => {
//         nodeList.forEach((node) => {
//           const nodeMatches = node.label
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase());
//           if (nodeMatches) {
//             newExpanded[node.label] = true;
//             findAndExpandParents(data, node.label);
//           }
//           if (node.children && node.children.length > 0) {
//             expandRecursive(node.children);
//           }
//         });
//       };

//       expandRecursive(data);
//       setExpandedItems(newExpanded);
//     }
//   }, [searchTerm, data, setExpandedItems, expandedItems]);

//   const getAllValues = (nodes) => {
//     let values = [];
//     for (const node of nodes) {
//       values.push(node.label);
//       if (node.children) {
//         values = values.concat(getAllValues(node.children));
//       }
//     }
//     return values;
//   };

//   const isFullyChecked = (nodes) => {
//     const all = getAllValues(nodes);
//     return all.every((v) => checkedItems[v]);
//   };

//   const toggleAll = (checked) => {
//     const all = getAllValues(data);
//     const updated = {};
//     for (const val of all) {
//       updated[val] = checked;
//     }
//     setCheckedItems(updated);
//   };

// const handleChange = (node, checked, children = []) => {
//   const updated = { ...checkedItems, [node.label]: checked };

//   // ✅ Set descendants
//   if (children.length > 0) {
//     const childValues = getAllValues(children);
//     for (const val of childValues) updated[val] = checked;
//   }

//   setCheckedItems(updated);

// };

//   const toggleExpand = (value) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [value]: !prev[value],
//     }));
//   };

//   // ✅ Collect full selected pincodes
// useEffect(() => {
//   if (onSelectionChange) {
//     const collectLeafNodes = (nodes, region, state, city) => {
//       let leaves = [];
//       console.log('nodesnodesdata',nodes)
//       nodes.forEach((n) => {
//         if (n.children && n.children.length > 0) {
//           leaves = leaves.concat(
//             collectLeafNodes(
//               n.children,
//               region || n.label,
//               state || n.label,
//               city || n.label
//             )
//           );
//         } else {
//           // 👇 Important: make sure we check using the same key (label here)
//           if (checkedItems[n.label]) {
//             leaves.push({
//               city: city || "",
//               state: state || "",
//               region: region || "",
//               label: n.label,
//               value: n.value,
//               pf_id: n.value,
//               latitude: n.latitude || null,
//               longitude: n.longitude || null,
//             });
//           }
//         }
//       });
//       console.log('leavesleavesleaves',leaves)
//       return leaves;
//     };

//     const selectedNodes = collectLeafNodes(data);
//     console.log("selectedNodesselectedNodes ✅", selectedNodes);
//   updateSelectedFilters("selectedLocation", selectedNodes);

//     onSelectionChange(selectedNodes);
//   }
// }, [checkedItems]);


//   return (
//     <>
//       <div
//         className={`space-y-2 transition-all duration-300 ${
//           expanded["location"]
//             ? "max-h-60 overflow-y-auto pr-2"
//             : "max-h-[102px] overflow-hidden"
//         }`}
//       >
//         <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-blue-600 rounded"
//             checked={isFullyChecked(data)}
//             onChange={(e) => toggleAll(e.target.checked)}
//           />
//           Select All
//         </label>
//         <div
//           className={`space-y-2 mt-2 transition-all duration-300 ${
//             expanded["location"]
//               ? "max-h-60 overflow-y-auto pr-2"
//               : "max-h-[102px] overflow-hidden"
//           }`}
//         >
//           {data.map((item) => (
//             <TreeNode
//               key={item.label}
//               node={item}
//               level={1}
//               checkedItems={checkedItems}
//               handleChange={handleChange}
//               expandedItems={expandedItems}
//               toggleExpand={toggleExpand}
//               getAllValues={getAllValues}
//             />
//           ))}
//         </div>
//       </div>
//       {data.length > 3 && (
//         <button
//           type="button"
//           className="text-blue-500 text-sm font-medium mt-3 flex items-center"
//           onClick={onToggle}
//         >
//           {expanded["location"] ? "View Less" : "View More"}
//           <span className="ml-1">
//             {expanded["location"] ? (
//               <IoIosArrowUp size={16} />
//             ) : (
//               <IoIosArrowDown size={16} />
//             )}
//           </span>
//         </button>
//       )}
//     </>
//   );
// };

// const TreeNode = ({
//   node,
//   level,
//   checkedItems,
//   handleChange,
//   expandedItems,
//   toggleExpand,
//   getAllValues,
// }) => {
//   const hasChildren = node.children && node.children.length > 0;
//   const descendantValues = hasChildren ? getAllValues(node.children) : [];
//   const childFullyChecked =
//     hasChildren &&
//     descendantValues.length > 0 &&
//     descendantValues.every((v) => checkedItems[v]);
//   const childPartiallyChecked =
//     hasChildren && descendantValues.some((v) => checkedItems[v]);

//   const ref = useRef();

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.indeterminate =
//         childPartiallyChecked && !childFullyChecked;
//     }
//   }, [checkedItems]);

//   return (
//     <div style={{ paddingLeft: level * 10 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//         {hasChildren && (
//           <span
//             style={{ cursor: "pointer", userSelect: "none" }}
//             onClick={() => toggleExpand(node.label)}
//           >
//             {expandedItems[node.label] ? (
//               <IoIosArrowDown />
//             ) : (
//               <IoIosArrowForward />
//             )}
//           </span>
//         )}
//         {!hasChildren && <span style={{ width: 12 }} />}{" "}
//         <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//           <input
//             type="checkbox"
//             ref={ref}
//             checked={
//               hasChildren
//                 ? descendantValues.length > 0 &&
//                   descendantValues.every((v) => checkedItems[v])
//                 : checkedItems[node.label] || false
//             }
//             className="w-4 h-4 text-blue-600 rounded"
//             onChange={(e) =>
//               handleChange(node, e.target.checked, node.children || [])
//             }
//           />
//         </label>
//         <span
//           onClick={() => hasChildren && toggleExpand(node.label)}
//           style={{ cursor: hasChildren ? "pointer" : "default" }}
//         >
//           {node.label}
//         </span>
//       </div>

//       {hasChildren && expandedItems[node.label] && (
//         <div>
//           {node.children.map((child) => (
//             <TreeNode
//               key={child.label}
//               node={child}
//               level={level + 1}
//               checkedItems={checkedItems}
//               handleChange={handleChange}
//               expandedItems={expandedItems}
//               toggleExpand={toggleExpand}
//               getAllValues={getAllValues}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TreeCheckbox;
















import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";

const TreeCheckbox = ({
  data,
  expanded,
  onToggle,
  onSelectionChange,
  defaultChecked = {},
  expandedItems,
  setExpandedItems,
  // searchTerm,
}) => {
  console.log('datatree',data)
  console.log('defaultChecked',defaultChecked)
  const { updateSelectedFilters } = useEbuxContext();
  const [checkedItems, setCheckedItems] = useState(defaultChecked);

  // 🔄 Sync when modal opens again
  useEffect(() => {
    setCheckedItems(defaultChecked);
  }, [defaultChecked]);

  const getAllValues = (nodes) => {
    let values = [];
    for (const node of nodes) {
      values.push(node.value); // ✅ use value
      if (node.children) {
        values = values.concat(getAllValues(node.children));
      }
    }
    return values;
  };

  const isFullyChecked = (nodes) => {
    const all = getAllValues(nodes);
    console.log('all.every',all.every((v) => checkedItems[v]))
    return all.every((v) => checkedItems[v]);
  };

  const toggleAll = (checked) => {
    const all = getAllValues(data);
    const updated = {};
    for (const val of all) updated[val] = checked;
    setCheckedItems(updated);
  };

  const handleChange = (node, checked, children = []) => {
    const updated = { ...checkedItems, [node.value]: checked };

    if (children.length > 0) {
      const childValues = getAllValues(children);
      for (const val of childValues) updated[val] = checked;
    }

    setCheckedItems(updated);
  };

  const toggleExpand = (value) => {
    setExpandedItems((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  // ✅ Collect full selected pincodes
  useEffect(() => {
    const collectLeafNodes = (nodes, region, state, city) => {
      let leaves = [];
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          leaves = leaves.concat(
            collectLeafNodes(
              n.children,
              region || n.label,
              state || n.label,
              city || n.label
            )
          );
        } else if (checkedItems[n.value]) {
          leaves.push({
            city: city || "",
            state: state || "",
            region: region || "",
            label: n.label,
            value: n.value,
            pf_id: n.value,
            latitude: n.latitude || null,
            longitude: n.longitude || null,
          });
        }
      });
      return leaves;
    };

    const selectedNodes = collectLeafNodes(data);
    updateSelectedFilters("selectedLocation", selectedNodes);
    onSelectionChange?.(selectedNodes);
  }, [checkedItems, data]);

  return (
    <>
      <div
        className={`space-y-2 transition-all duration-300 ${
          expanded["location"]
            ? "max-h-60 overflow-y-auto pr-2"
            : "max-h-[102px] overflow-hidden"
        }`}
      >
        <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={isFullyChecked(data)}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          Select All
        </label>
        <div
          className={`space-y-2 mt-2 transition-all duration-300 ${
            expanded["location"]
              ? "max-h-60 overflow-y-auto pr-2"
              : "max-h-[102px] overflow-hidden"
          }`}
        >
          {data.map((item) => (
            <TreeNode
              key={item.value}
              node={item}
              level={1}
              checkedItems={checkedItems}
              handleChange={handleChange}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              getAllValues={getAllValues}
            />
          ))}
        </div>
      </div>
      {data.length > 3 && (
        <button
          type="button"
          className="text-blue-500 text-sm font-medium mt-3 flex items-center"
          onClick={onToggle}
        >
          {expanded["location"] ? "View Less" : "View More"}
          <span className="ml-1">
            {expanded["location"] ? (
              <IoIosArrowUp size={16} />
            ) : (
              <IoIosArrowDown size={16} />
            )}
          </span>
        </button>
      )}
    </>
  );
};

const TreeNode = ({
  node,
  level,
  checkedItems,
  handleChange,
  expandedItems,
  toggleExpand,
  getAllValues,
}) => {
  // const hasChildren = node.children && node.children.length > 0;
  // const descendantValues = hasChildren ? getAllValues(node.children) : [];
  // const childFullyChecked =
  //   hasChildren &&
  //   descendantValues.length > 0 &&
  //   descendantValues.every((v) => checkedItems[v]);
  // const childPartiallyChecked =
  //   hasChildren && descendantValues.some((v) => checkedItems[v]);

  // const ref = useRef();
  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.indeterminate =
  //       childPartiallyChecked && !childFullyChecked;
  //   }
  // }, [checkedItems]);



  const hasChildren = node.children && node.children.length > 0;
  const descendantValues = hasChildren ? getAllValues(node.children) : [];

  const ref = useRef();

  // useEffect(() => {
  //   if (ref.current) {
  //     const allChecked =
  //       descendantValues.length > 0 &&
  //       descendantValues.every((v) => checkedItems[v]);
  //     const someChecked =
  //       descendantValues.length > 0 &&
  //       descendantValues.some((v) => checkedItems[v]);

  //     ref.current.indeterminate = hasChildren && someChecked && !allChecked;
  //     console.log('ref.current.indeterminate',descendantValues)
  //   }
  // }, [checkedItems]);

  useEffect(() => {
  if (ref.current) {
    const allChecked =
      descendantValues.length > 0 &&
      descendantValues.every((v) => checkedItems[v]);
    const someChecked =
      descendantValues.length > 0 &&
      descendantValues.some((v) => checkedItems[v]);

    // 👇 only true indeterminate state when children partially selected
    ref.current.indeterminate = hasChildren && someChecked && !allChecked;

    // Debug
    // console.log("🔍 node:", node.label, "descendants:", descendantValues, {
    //   allChecked,
    //   someChecked,
    //   checkedItems,
    // });
  }
}, [checkedItems]);

  return (
    <div style={{ paddingLeft: level * 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {hasChildren && (
          <span
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => toggleExpand(node.value)}
          >
            {expandedItems[node.value] ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </span>
        )}
        {!hasChildren && <span style={{ width: 12 }} />}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            checked={
              hasChildren
                ? descendantValues.length > 0 &&
                  descendantValues.every((v) => checkedItems[v])
                : checkedItems[node.value] || false
            }
            className="w-4 h-4 text-blue-600 rounded"
            onChange={(e) =>
              handleChange(node, e.target.checked, node.children || [])
            }
          />
        </label>
        <span
          onClick={() => hasChildren && toggleExpand(node.value)}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
        >
          {node.label}
        </span>
      </div>

      {hasChildren && expandedItems[node.value] && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.value}
              node={child}
              level={level + 1}
              checkedItems={checkedItems}
              handleChange={handleChange}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              getAllValues={getAllValues}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeCheckbox;
