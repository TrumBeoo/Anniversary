/**
 * Cấu hình mặc định cho trang
 */
const defaultConfig = {
    card_title: "Kỷ niệm 365 ngày bên nhau",
    card_subtitle: "TrumBeoo 💞 Vịt",
    card_message: "365 ngày yêu thương, 365 ngày hạnh phúc. Cảm ơn bé đã làm cuộc sống của anh trở nên ý nghĩa hơn. Yêu em bé của anh! 💕",
    
    memory_1_title: "Lần đầu gặp nhau",
    memory_1_text: "Khoảnh khắc định mệnh khi đôi mắt chúng ta chạm nhau, từ đó tình yêu bắt đầu nảy nở trong tim.",
    
    memory_2_title: "Chuyến du lịch đầu tiên",
    memory_2_text: "Những bước chân cùng nhau khám phá thế giới, tạo nên biết bao kỷ niệm không thể nào quên.",
    
    memory_3_title: "Ngày sinh nhật đặc biệt",
    memory_3_text: "Những lời chúc ngọt ngào và nụ cười rạng rỡ trong ngày đặc biệt của chúng ta."
};

/**
 * Render nội dung từ config
 */
async function render(config) {
    const mergedConfig = { ...defaultConfig, ...config };
    
    document.getElementById('cardTitle').textContent = mergedConfig.card_title;
    document.getElementById('cardMessage').textContent = mergedConfig.card_message;
    
    document.getElementById('memory1Title').textContent = mergedConfig.memory_1_title;
    document.getElementById('memory1Text').textContent = mergedConfig.memory_1_text;
    
    document.getElementById('memory2Title').textContent = mergedConfig.memory_2_title;
    document.getElementById('memory2Text').textContent = mergedConfig.memory_2_text;
    
    document.getElementById('memory3Title').textContent = mergedConfig.memory_3_title;
    document.getElementById('memory3Text').textContent = mergedConfig.memory_3_text;
}

/**
 * Map to SDK Capabilities
 */
function mapToCapabilities(config) {
    return {
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
    };
}

/**
 * Map to SDK Edit Panel Values
 */
function mapToEditPanelValues(config) {
    return new Map([
        ["card_title", config.card_title || defaultConfig.card_title],
        ["card_message", config.card_message || defaultConfig.card_message],
        ["memory_1_title", config.memory_1_title || defaultConfig.memory_1_title],
        ["memory_1_text", config.memory_1_text || defaultConfig.memory_1_text],
        ["memory_2_title", config.memory_2_title || defaultConfig.memory_2_title],
        ["memory_2_text", config.memory_2_text || defaultConfig.memory_2_text],
        ["memory_3_title", config.memory_3_title || defaultConfig.memory_3_title],
        ["memory_3_text", config.memory_3_text || defaultConfig.memory_3_text]
    ]);
}

/**
 * Initialize Element SDK
 */
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        render,
        mapToCapabilities,
        mapToEditPanelValues
    });
}

// Initial render
render(defaultConfig);