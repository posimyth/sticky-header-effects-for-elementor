(function ($) {
  'use strict';

  var TheplusAdminDialog = {
    cacheElements: function cacheElements() {
      this.cache = {
        $deactivateLink: $('#the-list').find('[data-slug="sticky-header-effects-for-elementor"] span.deactivate a'),
        $dialogHeader: $('#she-feedback-dialog-header'),
        $dialogForm: $('#she-feedback-dialog-form')
      };
    },
    bindEvents: function bindEvents() {
      var self = this;
      self.cache.$deactivateLink.on('click', function (event) {
        event.preventDefault();

        self.getModal().show();
      });
    },
    deactivate: function deactivate() {
      location.href = this.cache.$deactivateLink.attr('href');
    },
    initModal: function initModal() {
      var self = this, modal;

      self.getModal = function () {
        if (!modal) {
          modal = elementorCommon.dialogsManager.createWidget('lightbox', {
            id: 'she-deactivate-feedback-modal',
            headerMessage: self.cache.$dialogHeader,
            message: self.cache.$dialogForm,
            hide: {
              onButtonClick: false
            },
            position: {
              my: 'center',
              at: 'center'
            },
            onReady: function onReady() {
              DialogsManager.getWidgetType('lightbox').prototype.onReady.apply(this, arguments);

              this.addButton({
                name: 'submit',
                text: 'Submit & Deactivate',
                callback: self.sendFeedback.bind(self)
              });

              this.addButton({
                name: 'skip',
                text: 'Skip & Deactivate',
                callback: self.skipFeedback.bind(self)
              });
              $(document).on('click', '#she-feedback-close-button', function () {
                $('#she-deactivate-feedback-modal').hide();
              });
            },
            onShow: function onShow() {
              var $dialogModal = $('#she-deactivate-feedback-modal'),
                $textareaWrapper = $dialogModal.find('#she-other-reason-textarea-wrapper');

              $dialogModal.find('.she-feedback-option').off('click').on('click', function () {

                var associatedInputId = $(this).attr('for');
                var $radio = $('#' + associatedInputId);
                $radio.prop('checked', true);
                $textareaWrapper.show();
              });

            }
          });
        }

        return modal;
      };
    },
    sendFeedback: function sendFeedback() {
      var self = this,
        formData = self.cache.$dialogForm.serialize();

      var urlEncodedString = formData;
      var queryString = decodeURIComponent(urlEncodedString);
      var formData = new URLSearchParams(queryString);

      var issue_type = formData.get('she_issue_type');
      // if (!issue_type) {
      //   return;
      // }

      self.getModal().getElements('submit').text('').addClass('shed-loading');

      jQuery.ajax({
        url: formData.get('she_admin_url'),
        type: "post",
        data: {
          action: 'she_deactivate_rateus_notice',
          nonce: formData.get('nonce'),
          collect_email: formData.get('she_collect_email'),
          issue_type: issue_type,
          issue_text: formData.get('she_issue_text'),
        },
        beforeSend: function () {
        },
        success: function (response) {
          location.href = $('#the-list').find('[data-slug="sticky-header-effects-for-elementor"] span.deactivate a').attr('href')
        },
        error: function (xhr, status, error) {
          location.href = $('#the-list').find('[data-slug="sticky-header-effects-for-elementor"] span.deactivate a').attr('href')
        }
      });
    },
    skipFeedback: function skipFeedback() {
      location.href = $('#the-list').find('[data-slug="sticky-header-effects-for-elementor"] span.deactivate a').attr('href')
    },
    init: function init() {
      this.initModal();
      this.cacheElements();
      this.bindEvents();
    }
  };

  $(function () {
    TheplusAdminDialog.init();
  });

})(jQuery);