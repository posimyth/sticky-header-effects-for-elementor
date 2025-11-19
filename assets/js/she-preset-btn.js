(function ($) {
    const { __ } = wp.i18n;

    const ENABLE_TEMPLATES_TEXT = __("Enable Templates", "tpebl");

    jQuery("document").ready(function () {

        const urlParams = new URLSearchParams(window.location.search);
        const sheOnload = urlParams.get('she_onload');
        var she_global_notification = false;

        if (sheOnload === 'true') {
            const postId = 18061;
            she_load_wdkit(postId);
        }

        const url = new URL(window.location.href);
        url.searchParams.delete('she_onload');
        window.history.replaceState({}, '', url);

        jQuery(document).on('click', ".she-preset-editor-raw", function (event) {

            she_global_notification = true

            var $link = jQuery(this);

            $link.css({ "pointer-events": "none", "cursor": "not-allowed" });

            setTimeout(function () {
                $link.css({ "pointer-events": "auto", "cursor": "pointer" });
            }, 5000);

            let id = event.target?.dataset?.temp_id;

            she_load_wdkit(id);

        });

        const notice = `
        <div class="she-custom-editor-notice">
            <div class="she-toss-sections-first">
               <span class="she-custom-editor-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path fill="#575757" d="M15.24 14.133a.782.782 0 1 1-1.107 1.107L10 11.105 5.865 15.24a.782.782 0 1 1-1.106-1.107L8.893 10 4.76 5.864a.783.783 0 0 1 1.107-1.107L10 8.892l4.135-4.135a.783.783 0 0 1 1.107 1.106L11.107 10l4.133 4.134Z"/></svg>
               </span>
            </div>

            <div class="she-toss-sections-middeal">
              <span class="she-custom-editor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9D1A4F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM12 16v-4M12 8h.01"/></svg>
              </span>
              <div class="she-toss-middeal-text">Sticky Header Effects for Elementor is Activated</div>
            </div>

            <div class="she-toss-sections-end">
              <span>To access Sticky Header Effects settings, <strong>select a container </strong> or section, and then go to the <strong>Advanced tab</strong>. There, you’ll find the Sticky Header Effects settings where you can enable and configure the sticky header options.</span>
            </div>
        </div>
         `;

        var she_rebutton = true;

        function showNoticeAjx() {

            jQuery.ajax({
                url: she_wdkit_preview_popup.ajax_url,
                type: 'POST',
                async: true,
                data: {
                    action: 'she_insert_entry',
                    security: she_wdkit_preview_popup.nonce
                },
                success: function (response) {
                    if (response.success) {
                        $('body').append(notice);
                        setTimeout(function () {
                            $('.she-custom-editor-notice').addClass('she-show-animate');
                        }, 50);
                    }
                    she_rebutton = false;
                },
                error: function () {
                    she_rebutton = true;
                }
            });
        }

        jQuery(document).on('keydown', function (e) {
            if ((e.key === "Escape" || e.keyCode === 27) && she_global_notification) {
                showNoticeAjx();
                she_global_notification = false
            }
        });

        jQuery(document).on('click', ".she-design-from-scratch", function (event) {
            if (she_rebutton) {
                she_rebutton = false;
                $('body').append(notice);
                setTimeout(function () {
                    $('.she-custom-editor-notice').addClass('she-show-animate');
                }, 50);
                window.She_WdkitPopup.hide();
            }
        });

        jQuery(document).on('click', ".she-popup-close", function (event) {

            she_rebutton = false;

            window.She_WdkitPopup.hide();

            showNoticeAjx();

        });

        jQuery(document).on('click', ".she-custom-editor-close, .she-preset-editor-raw", function (event) {
            $('.she-custom-editor-notice').removeClass('she-show-animate').addClass('she-hide-animate');

            setTimeout(function () {
                $('.she-custom-editor-notice').remove();
                she_rebutton = true;
            }, 400);
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

                                    dialogLightboxContent.on("click", ".she-popup-close", function () {
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

                            $loader.css('visibility', 'visible');

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

                                    if (res.data === 'permission_error') {
                                        alert('Only site admins can install presets. Please ask your admin to complete the installation.');
                                    }

                                    if (true === res.success) {
                                        elementor.saver.update.apply().then(function () {
                                            window.location.hash = window.location.hash + '?wdesignkit=open&she=true'
                                            window.location.reload();
                                            $loader.css('visibility', 'hidden');

                                        });

                                    } else {
                                        $text.text(ENABLE_TEMPLATES_TEXT);
                                        $loader.css('visibility', 'hidden');

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