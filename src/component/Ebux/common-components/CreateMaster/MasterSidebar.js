import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function MasterSidebar() {
    const location = useLocation();
    const navItems = [
        { name: 'Brands', path: '/createMaster', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster", "/createMaster/add-brand"] },
        { name: 'Sub Brands', path: '/createMaster/sub-brand', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/sub-brand", "/createMaster/add-sub-brand"] },
        { name: 'Category', path: '/createMaster/category', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/category","/createMaster/add-category"] },
        { name: 'Sub Category', path: '/createMaster/sub-category', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/sub-category"] },
        { name: 'Locations', path: '/createMaster/location', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/location"] },
        { name: 'Seller List', path: '/createMaster/seller-list', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/seller-list"] },
        { name: 'Keyword Configuration', path: '/createMaster/keyword-configuration', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/keyword-configuration"] },
        { name: 'Product SKU Mapping', path: '/createMaster/product-sku-mapping', icon: '/assets/images/brandIcon.svg', activeMatch: ["/createMaster/product-sku-mapping"] },
    ];
    const isActiveFor = (item) => {
        const path = location.pathname || "";
        const matches = item.activeMatch ?? [item.path];

        return matches.some((m) => {
            if (!m) return false;

            const normPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
            const normM = m.endsWith('/') && m !== '/' ? m.slice(0, -1) : m;

            if (normM === '/createMaster') {
                return normPath === normM;
            }

            if (normPath === normM) return true;
            if (normPath.startsWith(normM + '/')) return true;
            if (normPath.startsWith(normM)) return true;

            return false;
        });
    };

    return (
        <aside className="w-[352px] bg-white border-r border-gray-200 ml-3">
            <div className='flex bg-[#FAFAFA] border-[1px] border-solid border-black/6 p-[12px] justify-between'>
                <div className="text-md font-semibold mt-2">Configuration</div>
            </div>

            <nav className="space-y-2 p-4">
                {navItems.map((item, i) => {
                    const isActive = isActiveFor(item);
                    return (
                        <Link to={item?.path} key={i} className={`p-3 rounded-md ${isActive ? 'bg-[#1890FF1A]' : 'bg-gray-100'} cursor-pointer text-sm flex items-center gap-2`}>
                            {/* <div key={item.name} className={`p-3 rounded-md ${location?.pathname == item?.path ? 'bg-[#1890FF1A] cursor-default' : 'bg-gray-100 cursor-pointer'}  text-sm flex items-center gap-2`}> */}
                            <div className="bg-white p-2 rounded">
                                <img src={item.icon} alt={item.name} className="w-5 h-5" />
                            </div>
                            <span >{item.name}</span>
                            {/* </div> */}
                        </Link>
                    )
                }
                )}
            </nav>
        </aside>
    );
}