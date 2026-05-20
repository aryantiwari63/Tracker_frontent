import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const SortableTab=({ id, selectedTableRows, breakdownTabData, selectedCount,
    selectedTotal})=>{


    const {
        attributes: TabAttributes,
        listeners: TabListeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });


 
    

    const style = {
        transform: CSS?.Transform?.toString(transform),
        transition,
        zIndex: transform ? 999 : 'auto',
        position: transform ? 'relative' : 'static',
    };
    const iconURL = {
        "Category": "/assets/images/categorytIcon.svg",
        "SKU": "/assets/images/productIcon.svg",
        "Location": "/assets/images/locationIcon.svg",
        "Brand": "/assets/images/brandIcon.svg",
        "Platform": "/assets/images/platformIcon.svg",
        "Keyword":"/assets/images/productIcon.svg",
        "Banner":"/assets/images/bannerIcon.svg",
        "Dark Store ID":"/assets/images/locationIcon.svg",
        "Reviews":"/assets/images/productIcon.svg",
        "Competition Reviews":"/assets/images/productIcon.svg",
        "Category Node": "/assets/images/platformIcon.svg",

    }





    return (
        <div
            ref={setNodeRef}
            style={style}
        >

            {
                id==="Reviews" ? ( <div className="tabBtnBox" {...TabListeners} {...TabAttributes}><img src={iconURL?.[id??"Category"]} width={18} height={18} className="tabIcon" /> {id} <div className="tblTag" >{`${selectedCount}/${selectedTotal?.["Reviews"]}`}</div></div>)
                :id==="Competition Reviews" ? ( <div className="tabBtnBox" {...TabListeners} {...TabAttributes}><img src={iconURL?.[id??"Category"]} width={18} height={18} className="tabIcon" /> {id} <div className="tblTag" >{`${selectedCount}/${selectedTotal?.["Competition Reviews"]}`}</div></div>)
                :( <div className="tabBtnBox" {...TabListeners} {...TabAttributes}><img src={iconURL?.[id??"Category"]} width={18} height={18} className="tabIcon" /> {id} <div className="tblTag" >{selectedTableRows?.[id?.toLowerCase()]?.length}/{breakdownTabData?.[id?.toLowerCase()]?.length}</div></div>
            )
            }
               </div>
    );
}
export default SortableTab;