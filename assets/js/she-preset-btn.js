(function ($) {
    const { __ } = wp.i18n;

    const ENABLE_TEMPLATES_TEXT = __("Enable Templates", "tpebl");

    jQuery("document").ready(function () {

        const urlParams = new URLSearchParams(window.location.search);
        const sheOnload = urlParams.get('she_onload');

        if (sheOnload === 'true') {
            const postId = 18061;
            she_load_wdkit(postId);
        }

        jQuery(document).on('click', ".she-preset-editor-raw", function (event) {

            var $link = jQuery(this);

            $link.css({ "pointer-events": "none", "cursor": "not-allowed" });

            setTimeout(function () {
                $link.css({ "pointer-events": "auto", "cursor": "pointer" });
            }, 5000);

            let id = event.target?.dataset?.temp_id;

            she_load_wdkit(id);

        });

        function she_load_wdkit(id) {

            jQuery.ajax({
                url: she_wdkit_preview_popup.ajax_url,
                dataType: 'json',
                type: "post",
                async: true,
                data: {
                    action: 'check_plugin_status',
                    security: she_wdkit_preview_popup.nonce,
                },
                success: function (res) {

                    if (res?.installed) {
                        var e;
                        if (!e && id) {
                            window.She_WdkitPopup = elementorCommon.dialogsManager.createWidget("lightbox", {
                                id: "wdkit-elementor",
                                className: 'wkit-contentbox-modal wdkit-elementor',
                                headerMessage: !1,
                                message: "",
                                hide: {
                                    auto: !1,
                                    onClick: !1,
                                    onOutsideClick: !1,
                                    onOutsideContextMenu: !1,
                                    onBackgroundClick: !0
                                },
                                position: {
                                    my: "center",
                                    at: "center"
                                },
                                onShow: function () {
                                    var e = window.She_WdkitPopup.getElements("content");
                                    window.location.hash = '#/preset/' + id + "?she=true";
                                    window.WdkitPopupToggle.open({ route: "/preset/" + id + "?she=true" }, e.get(0), "stickey-header");
                                },
                                onHide: function () {
                                    var e = window.She_WdkitPopup.getElements("content");
                                    window.WdkitPopupToggle.close(e.get(0)), window.She_WdkitPopup.destroy()
                                }
                            }),
                                window.She_WdkitPopup.getElements("header").remove(), window.She_WdkitPopup.getElements("message").append(window.She_WdkitPopup.addElement("content"))
                        }
                        return window.She_WdkitPopup.show()
                    } else {
                        window.She_WdkitPopup = elementorCommon.dialogsManager.createWidget(
                            "lightbox",
                            {
                                id: "she-wdkit-elementorp",
                                headerMessage: !1,
                                message: "",
                                hide: {
                                    auto: !1,
                                    onClick: !1,
                                    onOutsideClick: false,
                                    onOutsideContextMenu: !1,
                                    onBackgroundClick: !0,
                                },
                                position: {
                                    my: "center",
                                    at: "center",
                                },
                                onShow: function () {
                                    var dialogLightboxContent = $(".dialog-lightbox-message"),
                                        clonedWrapElement = $("#she-wdkit-wrap");
                                    window.location.hash = '#/preset/' + id;

                                    clonedWrapElement = clonedWrapElement.clone(true).show()
                                    dialogLightboxContent.html(clonedWrapElement);

                                    dialogLightboxContent.on("click", ".tp-close-btn", function () {
                                        window.She_WdkitPopup.hide();
                                    });
                                },
                                onHide: function () {
                                    window.She_WdkitPopup.destroy();
                                }
                            }
                        );

                        $(document).on('click', '.she-wdesign-install', function (e) {
                            e.preventDefault();

                            var $button = $(this);
                            var $loader = $button.find('.she-wb-loader-circle');
                            var $text = $button.find('.she-enable-text');

                            $loader.css('display', 'block');

                            jQuery.ajax({
                                url: she_wdkit_preview_popup.ajax_url,
                                dataType: 'json',
                                type: "post",
                                async: true,
                                data: {
                                    action: 'she_install_wdkit',
                                    security: she_wdkit_preview_popup.nonce,
                                },
                                success: function (res) {

                                    if (true === res.success) {
                                        elementor.saver.update.apply().then(function () {
                                            window.location.hash = window.location.hash + '?wdesignkit=open&she=true'
                                            window.location.reload();
                                            $loader.css('display', 'none');

                                        });

                                    } else {
                                        $text.text(ENABLE_TEMPLATES_TEXT);
                                        $loader.css('display', 'none');

                                    }


                                },
                                error: function () {
                                    $loader.css('display', 'none');
                                    $text.css('display', 'block').text(ENABLE_TEMPLATES_TEXT);
                                }
                            });
                        });

                        return window.She_WdkitPopup.show();
                    }
                },
                error: function (res) {
                }
            });
        }
    });
})(jQuery);